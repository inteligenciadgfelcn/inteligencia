<%@ Page Title="" Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/PaginaPrin.master" AutoEventWireup="true" CodeFile="FRM-OP.aspx.cs" Inherits="Forms_FRM_OP" %>
<%@ Register assembly="GMaps" namespace="Subgurim.Controles" tagprefix="cc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="animate__animated p-6">
        <div x-data="sales">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">FORMULARIO UNICO DE REGISTRO DE OPERATIVOS ANTINARCOTICOS</a></li>
            </ol>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">DATOS GENERALES<asp:Label ID="lblidcaso" runat="server" Visible="False"></asp:Label>
                </h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Operativo</div>                       
                        <asp:Label ID="txtnroop" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Relevancia</div>
                        <asp:DropDownList ID="cborelevancia" runat="server" class="form-select form-select-sm text-white-dark"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv0" runat="server" ErrorMessage="*" ControlToValidate="cborelevancia" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Informe</div>
                        <asp:TextBox ID="txtnroinf" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                        &nbsp;
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre del Caso</div>
                        <asp:Label ID="txtnombrecaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Unidad</div>
                        <asp:DropDownList ID="cbounidad" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cbounidad_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv1" runat="server" ErrorMessage="*" ControlToValidate="cbounidad" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Distrital</div>
                        <asp:DropDownList ID="cboDistrital" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cboDistrital_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv2" runat="server" ErrorMessage="*" ControlToValidate="cboDistrital" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Grupo</div>
                        <asp:DropDownList ID="cboGrupo" runat="server" class="form-select form-select-sm text-white-dark"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv3" runat="server" ErrorMessage="*" ControlToValidate="cboGrupo" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Quien Realiza la Solicitud</div>
                        <asp:Label ID="txtsolicita" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Celular</div>
                        <asp:Label ID="fonosolicita" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Asignado al Caso</div>
                        <asp:Label ID="txtasignadocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Celular</div>
                        <asp:Label ID="fonoasignado" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fiscal Asignado</div>
                        <asp:Label ID="txtfiscalasignado" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Celular</div>
                        <asp:Label ID="fonofiscal" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de la Denuncia</div>
                        <asp:DropDownList ID="cbotipodenuncia" runat="server" class="form-select form-select-sm text-white-dark" Width="300px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv4" runat="server" ErrorMessage="*" ControlToValidate="cbotipodenuncia" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo Penal</div>
                        <asp:DropDownList ID="cbotipopenal" runat="server" class="form-select form-select-sm text-white-dark" Width="300px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv5" runat="server" ErrorMessage="*" ControlToValidate="cbotipopenal" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fecha y Hora del Operativo</div>
                        <asp:Label ID="txtfechaoperativo" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="250px"></asp:Label>                        
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Departamento</div>
                        <asp:DropDownList ID="cbodepartamento" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cbodepartamento_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv6" runat="server" ErrorMessage="*" ControlToValidate="cbodepartamento" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Provincia</div>
                        <asp:DropDownList ID="cboprovincia" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="cboprovincia_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv7" runat="server" ErrorMessage="*" ControlToValidate="cboprovincia" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Municipio</div>
                        <asp:DropDownList ID="cbomunicipio" runat="server" class="form-select form-select-sm text-white-dark"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv8" runat="server" ErrorMessage="*" ControlToValidate="cbomunicipio" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">En la localidad, comunidad, direccion (Zona, Calle, Avenida, Barrio)</div>
                        <asp:TextBox ID="txtlugar" runat="server" placeholder="" class="form-input form-input-sm" Width="750px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfv9" runat="server" ErrorMessage="*" ControlToValidate="txtlugar" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Operativo Realizado en</div>
                        <asp:DropDownList ID="cbocategoria" runat="server" class="form-select form-select-sm text-white-dark" Width="400px" AutoPostBack="True" OnSelectedIndexChanged="cbocategoria_SelectedIndexChanged"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv10" runat="server" ErrorMessage="*" ControlToValidate="cbocategoria" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <asp:DropDownList ID="cbosubcategoria" runat="server" class="form-select form-select-sm text-white-dark" Width="400px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv11" runat="server" ErrorMessage="*" ControlToValidate="cbosubcategoria" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Al Mando de</div>
                        <asp:TextBox ID="TxtAlMando" runat="server" placeholder="" class="form-input form-input-sm" Width="450px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfv12" runat="server" ErrorMessage="*" ControlToValidate="TxtAlMando" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Plan de Operaciones</div>
                        <asp:DropDownList ID="cboplanoperaciones" runat="server" class="form-select form-select-sm text-white-dark" Width="400px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv13" runat="server" ErrorMessage="*" ControlToValidate="cboplanoperaciones" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">El Operativo es de Tipo</div>
                        <asp:DropDownList ID="cbotipoop" runat="server" class="form-select form-select-sm text-white-dark" Width="400px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfv14" runat="server" ErrorMessage="*" ControlToValidate="cbotipoop" InitialValue="Seleccione un Dato" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Clan Familiar</div>
                        <asp:TextBox ID="txtclanfamiliar" runat="server" placeholder="" class="form-input form-input-sm" Width="350px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Organizacion Criminal</div>
                        <asp:TextBox ID="txtorganizacion" runat="server" placeholder="" class="form-input form-input-sm" Width="350px"></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">latitud</div>
                        <asp:TextBox ID="grax" runat="server" placeholder="grados" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <asp:TextBox ID="minx" runat="server" placeholder="Minutos" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <asp:TextBox ID="segx" runat="server" placeholder="Segundos" class="form-input form-input-sm" x-tooltip="Ej: 25,23 Con el uso de la coma" Width="70px"></asp:TextBox>
                        &nbsp;<asp:TextBox ID="txtlat" runat="server" placeholder="Latitud" class="form-input form-input-sm" Width="150px" Enabled="False"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Longitud</div>
                        <asp:TextBox ID="gray" runat="server" placeholder="grados" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <asp:TextBox ID="miny" runat="server" placeholder="Minutos" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <asp:TextBox ID="segy" runat="server" placeholder="Segundos" class="form-input form-input-sm" x-tooltip="Ej: 25,23 Con el uso de la coma" Width="70px"></asp:TextBox>
                        &nbsp;<asp:TextBox ID="txtlng" runat="server" placeholder="Longitud" class="form-input form-input-sm" Width="150px" Enabled="False"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btnmarcar" runat="server" Text="Marcar ubicacion" class="btn btn-info" OnClick="btnmarcar_Click" />
                    </div>
                </div>
                <br />
                <cc1:GMap ID="GMap1" runat="server" Height="450px" Width="100%" enableGoogleBar="True" enableRotation="True" enableHookMouseWheelToZoom="True" Key="AIzaSyATk3Cyhpv0pMmAQpjkZsH24DEdx6i1bTk" DataLatField="-16,518795206997527" DataLngField="-68,12829496977712" mapType="Satellite" Libraries="Panoramio" />
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Breve Detalle del Operativo</div>
                        <asp:TextBox ID="txtbrevedetalle" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Height="350px" TextMode="MultiLine"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfv15" runat="server" ErrorMessage="*" ControlToValidate="txtbrevedetalle" ValidationGroup="operativo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <%--<div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Informe del Operativo</div>
                        <asp:TextBox ID="txtDetalle" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Height="370px" TextMode="MultiLine" Visible="False"></asp:TextBox>
                    </div>
                </div>
                <br />--%>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                    </div>
                    <div class="flex">
                        <asp:Button ID="Button1" runat="server" Text="Guardar" class="btn btn-primary" ValidationGroup="operativo" OnClick="Button1_Click"/>
                    </div>
                    <div class="flex">
                        <asp:Label ID="lblidop" runat="server" Visible="False"></asp:Label>
                    </div>
                </div>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de Droga</div>
                        <asp:DropDownList ID="cbotipodrogas" runat="server" class="form-select form-select-sm text-white-dark" Width="250px" OnSelectedIndexChanged="cbotipodrogas_SelectedIndexChanged" AutoPostBack="True"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfdrog0" runat="server" ErrorMessage="*" ControlToValidate="cbotipodrogas" InitialValue="Seleccione un Dato" ValidationGroup="droga" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Estado de la Droga</div>
                        <asp:DropDownList ID="cboestadodroga" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfdrog1" runat="server" ErrorMessage="*" ControlToValidate="cboestadodroga" InitialValue="Seleccione un Dato" ValidationGroup="droga" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Cocaina Liquida en Litros</div>
                        <asp:TextBox ID="txtdrliq" runat="server" placeholder="Ej. 25 lts o 25,5 lts y dlts" class="form-input form-input-sm" Width="170px" x-tooltip="Para Decimales Usar , (Coma)" ></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Cantidad</div>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tn</div>
                        <asp:TextBox ID="txtcantn" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Kg</div>
                        <asp:TextBox ID="txtcankl" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">g</div>
                        <asp:TextBox ID="txtcantgr" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Mg</div>
                        <asp:TextBox ID="txtcantmg" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nro. Pastillas o Capsulas (Tragones)</div>
                        <asp:TextBox ID="txtcantunid" runat="server" placeholder="" class="form-input form-input-sm" Width="80px"></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Forma de Transporte</div>
                        <asp:DropDownList ID="cboformatran" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfdrog2" runat="server" ErrorMessage="*" ControlToValidate="cboformatran" InitialValue="Seleccione un Dato" ValidationGroup="droga" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Procedencia</div>
                        <asp:DropDownList ID="cboproceden" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfdrog3" runat="server" ErrorMessage="*" ControlToValidate="cboproceden" InitialValue="Seleccione un Dato" ValidationGroup="droga" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Destino</div>
                        <asp:DropDownList ID="cbodestino" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="rfdrog4" runat="server" ErrorMessage="*" ControlToValidate="cbodestino" InitialValue="Seleccione un Dato" ValidationGroup="droga" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fotografia Prueba de Campo</div>
                        <asp:FileUpload ID="fuopruebacampo" runat="server" class="btn btn-warning btn-sm" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="rfdrog5" runat="server" ErrorMessage="*" ControlToValidate="fuopruebacampo" ValidationGroup="droga" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegExp1" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fuopruebacampo" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fotografia Cuantificacion y Pesaje</div>
                        <asp:FileUpload ID="fuopesaje" runat="server" class="btn btn-warning btn-sm" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="rfdrog6" runat="server" ErrorMessage="*" ControlToValidate="fuopesaje" ValidationGroup="droga" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegExp2" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fuopesaje" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                    </div>
                </div>
            </div>
            <br />
            <asp:Button ID="btninsdroga" runat="server" Text="Guardar" class="btn btn-primary w-full" Width="250px" ValidationGroup="droga" OnClick="btninsdroga_Click" OnClientClick="javascript:showAlerguarda();"/>
            <br />
            <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" Width="100%" class="table-hover" OnRowDeleting="GridView1_RowDeleting" OnSelectedIndexChanged="GridView1_SelectedIndexChanged">
                <Columns>
                    <asp:BoundField DataField="droga1" HeaderText="Id" />
                    <asp:BoundField DataField="droga2" HeaderText="Tipo de Droga" />
                    <asp:BoundField DataField="droga3" HeaderText="Estado de la Droga" />
                    <asp:BoundField DataField="droga4" HeaderText="Cantidad (gramos) / Litros" DataFormatString="{0:0,0.00}"/>
                    <asp:BoundField DataField="droga5" HeaderText="Nro. de Capsulas" />
                    <asp:BoundField DataField="droga6" HeaderText="Forma de Transporte" />
                    <asp:BoundField DataField="droga7" HeaderText="Procedencia" />
                    <asp:BoundField DataField="droga8" HeaderText="Destino" />
                    <asp:TemplateField ShowHeader="False">
                        <ItemTemplate>
                            <asp:Button ID="Button1" runat="server" CausesValidation="False" class="btn btn-secondary" CommandName="Select" Text="Añadir Logo" />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                </Columns>
            </asp:GridView>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">FOTOGRAFIA DE LA PRUEBA DE CAMPO Y LA CUANTIFICACION, PESAJE DE LA SUSTANCIA SECUESTRADA<asp:Label ID="Label1" runat="server" Visible="False"></asp:Label>
                </h5>
            </div>
            <div class="mb-5">
                <asp:GridView ID="GridPesaje" runat="server" AutoGenerateColumns="False" Width="100%" class="table-hover">
                    <Columns>                        
                        <asp:BoundField DataField="PES1" HeaderText="Id" />
                        <asp:BoundField DataField="PES2" HeaderText="Tipo de Droga" />
                        <asp:TemplateField HeaderText="Prueba de Campo">
                            <ItemTemplate>
                                <asp:Image ID="Imagep1" runat="server" Height="150px" Width="200px" ImageUrl='<%# Eval("PES1", "~/Forms/pesaje.ashx?Id={0}") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Cuantificacion y Pesaje">
                            <ItemTemplate>
                                <asp:Image ID="Imagep2" runat="server" Height="150px" Width="200px" ImageUrl='<%# Eval("PES1", "~/Forms/prueba.ashx?Id={0}") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>                       
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">LOGOTIPOS
                    <asp:Label ID="lbltipodroga" runat="server" Visible="False"></asp:Label>
                    <asp:Label ID="lblpaisorig" runat="server" Visible="False"></asp:Label>
                    <asp:Label ID="lblpaisdest" runat="server" Visible="False"></asp:Label>
                </h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Imagen </div>
                        <asp:TextBox ID="txtlogo" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Enabled="False"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvlogo1" runat="server" ErrorMessage="*" ControlToValidate="txtlogo" ValidationGroup="logo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Descripcion del Logo</div>
                        <asp:TextBox ID="txtdescriplogo" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Height="70px" TextMode="MultiLine" Enabled="False"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfvlogo2" runat="server" ErrorMessage="*" ControlToValidate="txtdescriplogo" ValidationGroup="logo" ForeColor="Red"></asp:RequiredFieldValidator>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Organizacion Criminal</div>
                        <asp:TextBox ID="txtorgcrim" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Enabled="False"></asp:TextBox>                        
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Posibles Blancos</div>
                        <asp:TextBox ID="txtblanco" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Height="70px" TextMode="MultiLine" Enabled="False"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Observacion</div>
                        <asp:TextBox ID="txtobservacion" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Height="70px" TextMode="MultiLine" Enabled="False"></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fotografia</div>
                        <asp:FileUpload ID="fuimagen" runat="server" class="btn btn-warning btn-sm" accept=".jpg, .jpeg" Enabled="False" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="rfvlogo3" runat="server" ErrorMessage="*" ControlToValidate="fuimagen" ValidationGroup="logo" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegExpVal1" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fuimagen" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                    </div>
                </div>
                <br />
                <div class="flex">
                    <asp:Button ID="btnlogo" runat="server" Text="Añadir Logo" class="btn btn-success" ValidationGroup="logo" OnClick="btnlogo_Click" Enabled="False" OnClientClick="javascript:showAlerguarda();"/>
                </div>
                <br />
                <asp:GridView ID="GridLogo" runat="server" AutoGenerateColumns="False" Font-Size="X-Small" Width="100%" OnRowDeleting="GridLogo_RowDeleting">
                    <Columns>
                        <asp:BoundField DataField="Log1" HeaderText="Cod. Id." />
                        <asp:BoundField DataField="Log2" HeaderText="Imagen" />
                        <asp:BoundField DataField="Log3" HeaderText="Descripcion" />
                        <asp:BoundField DataField="Log4" HeaderText="Tipo de Droga" />
                        <asp:BoundField DataField="Log5" HeaderText="Pais Origen" />
                        <asp:BoundField DataField="Log6" HeaderText="Pais Destino" />
                        <asp:BoundField DataField="Log7" HeaderText="Organizacion" />
                        <asp:BoundField DataField="Log8" HeaderText="Implicados" />
                        <asp:BoundField DataField="Log9" HeaderText="Observacion" />
                        <asp:TemplateField HeaderText="Fotografia">
                            <ItemTemplate>
                                <asp:Image ID="Image2" runat="server" Height="150px" Width="200px" ImageUrl='<%# Eval("Log1", "~/Forms/ImageLogo.ashx?Id={0}") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">SUSTANCIAS QUIMICAS CONTROLADAS SOLIDAS</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de Sustancia</div>
                        <asp:DropDownList ID="cbosussol" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Cantidad</div>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Kilos</div>
                        <asp:TextBox ID="txtcantssk" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Gramos</div>
                        <asp:TextBox ID="txtcantssg" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btnsussol" runat="server" Text="Agregar Sustancia" class="btn btn-success" OnClick="btnsussol_Click" OnClientClick="javascript:showAlerguarda();"/>
                    </div>
                </div>
                <br />
                <asp:GridView ID="GridView2" runat="server" AutoGenerateColumns="False" Width="100%" OnRowDeleting="GridView2_RowDeleting">
                    <Columns>
                        <asp:BoundField DataField="sussol1" HeaderText="Id" />
                        <asp:BoundField DataField="sussol2" HeaderText="Nombre de Sustancia Solida" />
                        <asp:BoundField DataField="sussol3" HeaderText="Cantidad en Kilos"  DataFormatString="{0:0,0.0000}"/>
                        <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">SUSTANCIAS QUIMICAS CONTROLADAS LIQUIDAS</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de Sustancia</div>
                        <asp:DropDownList ID="cbosusliq" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Cantidad</div>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Litros</div>
                        <asp:TextBox ID="txtcantsll" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Mililitros</div>
                        <asp:TextBox ID="txtcantslm" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btnsusliq" runat="server" Text="Agregar Sustancia" class="btn btn-warning" OnClick="btnsusliq_Click" OnClientClick="javascript:showAlerguarda();"/>
                    </div>
                </div>
                <br />
                <asp:GridView ID="GridView3" runat="server" AutoGenerateColumns="False" Width="100%"
                    OnRowDeleting="GridView3_RowDeleting">
                    <Columns>
                        <asp:BoundField DataField="susliq1" HeaderText="Id" />
                        <asp:BoundField DataField="susliq2" HeaderText="Nombre de Sustancia Liquida" />
                        <asp:BoundField DataField="susliq3" HeaderText="Cantidad en Litros" DataFormatString="{0:0,0.0000}"/>                        
                        <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">LABORATORIOS Y FABRICAS</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo</div>
                        <asp:DropDownList ID="cbotipofl" runat="server" class="form-select form-select-sm text-white-dark" Width="200px" OnSelectedIndexChanged="cbotipofl_SelectedIndexChanged" AutoPostBack="True"></asp:DropDownList>
                        <asp:DropDownList ID="cbocaracfl" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Cantidad</div>
                        <asp:TextBox ID="txtcantfl" runat="server" placeholder="" class="form-input form-input-sm" Width="70px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btntipofl" runat="server" Text="Agregar tipo" class="btn btn-danger" OnClick="btntipofl_Click" OnClientClick="javascript:showAlerguarda();"/>
                    </div>
                </div>
                <br />
                <asp:GridView ID="GridView5" runat="server" AutoGenerateColumns="False" Width="100%" OnRowDeleting="GridView5_RowDeleting">
                    <Columns>
                        <asp:BoundField DataField="fab1" HeaderText="Id" />
                        <asp:BoundField DataField="fab2" HeaderText="Tipo de Elaboracion" />
                        <asp:BoundField DataField="fab3" HeaderText="Estilo de Elaboracion" />
                        <asp:BoundField DataField="fab4" HeaderText="Cantidad" />
                        <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">PERSONAS: PRINCIPAL IMPLICADO / APREHENDIDAS / ARRESTADAS / LGI O PERDIDA DE DOMINIO</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre(s)</div>
                        <asp:TextBox ID="TextBox1" runat="server" placeholder="" class="form-input form-input-sm" Width="170px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfper1" runat="server" ErrorMessage="*" ControlToValidate="TextBox1" ValidationGroup="personas" ForeColor="Red"></asp:RequiredFieldValidator>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Ap. Paterno</div>
                        <asp:TextBox ID="TextBox2" runat="server" placeholder="" class="form-input form-input-sm" Width="170px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfper2" runat="server" ErrorMessage="*" ControlToValidate="TextBox2" ValidationGroup="personas" ForeColor="Red"></asp:RequiredFieldValidator>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Ap. Materno</div>
                        <asp:TextBox ID="TextBox3" runat="server" placeholder="" class="form-input form-input-sm" Width="170px"></asp:TextBox>                        
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Ap. Esposo</div>
                        <asp:TextBox ID="TextBox4" runat="server" placeholder="" class="form-input form-input-sm" Width="170px"></asp:TextBox>
                        
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nacionalidad</div>
                        <asp:DropDownList ID="CboNacionalidad" runat="server" class="form-select form-select-sm text-white-dark" Width="150px"></asp:DropDownList>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="*" ControlToValidate="CboNacionalidad" InitialValue="Seleccione un Dato" ValidationGroup="personas" ForeColor="Red"></asp:RequiredFieldValidator>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Genero</div>
                        <asp:DropDownList ID="cbogenero" runat="server" class="form-select form-select-sm text-white-dark" Width="110px">
                            <asp:ListItem Value="1">Masculino</asp:ListItem>
                            <asp:ListItem Value="0">Femenino</asp:ListItem>
                        </asp:DropDownList>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de Documento</div>
                        <asp:DropDownList ID="cbotipodoc" runat="server" class="form-select form-select-sm text-white-dark" Width="250px">
                            <asp:ListItem Value="12">Ninguno</asp:ListItem>
                            <asp:ListItem Value="1">Cedula de Identidad</asp:ListItem>
                            <asp:ListItem Value="2">Registro Unico Nacional (RUN)</asp:ListItem>
                            <asp:ListItem Value="3">Registro Nacional (RIN)</asp:ListItem>
                            <asp:ListItem Value="4">Pasaporte</asp:ListItem>
                            <asp:ListItem Value="5">Salvoconducto</asp:ListItem>
                            <asp:ListItem Value="6">Licencia de Conducir</asp:ListItem>
                            <asp:ListItem Value="7">Libreta de Servicio Militar</asp:ListItem>
                            <asp:ListItem Value="8">Cedula Extranjera</asp:ListItem>
                            <asp:ListItem Value="9">Otros</asp:ListItem>
                            <asp:ListItem Value="10">Cedula Electoral</asp:ListItem>
                            <asp:ListItem Value="11">DNI</asp:ListItem>
                        </asp:DropDownList>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Documento</div>
                        <asp:TextBox ID="TextBox7" runat="server" placeholder="Ej. 123458-1A" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fecha de Nacimiento</div>
                        <asp:TextBox ID="TextBox5" runat="server" placeholder="Ej. 12/12/2025" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfper3" runat="server" ErrorMessage="*" ControlToValidate="TextBox5" ValidationGroup="personas" ForeColor="Red"></asp:RequiredFieldValidator>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Direccion</div>
                        <asp:TextBox ID="TextBox6" runat="server" placeholder="" class="form-input form-input-sm" Width="450px"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="rfper4" runat="server" ErrorMessage="*" ControlToValidate="TextBox6" ValidationGroup="personas" ForeColor="Red"></asp:RequiredFieldValidator>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Estado de la Persona</div>
                        <asp:DropDownList ID="ddlestado" runat="server" class="form-select form-select-sm text-white-dark" Width="250px">
                            <asp:ListItem>Principal Implicado</asp:ListItem>
                            <asp:ListItem>Aprehendido</asp:ListItem>
                            <asp:ListItem>Arrestado</asp:ListItem>
                            <asp:ListItem Value="LGI">LGI O Perdida de Dominio</asp:ListItem>
                        </asp:DropDownList>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Foto Frente</div>
                        <asp:FileUpload ID="fupff" runat="server" class="btn btn-warning btn-sm" accept=".jpg, .jpeg" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="rfper5" runat="server" ErrorMessage="*" ControlToValidate="fupff" ValidationGroup="personas" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegularExpressionValidator2" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fupff" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Foto Perfil Izquierdo</div>
                        <asp:FileUpload ID="fuppi" runat="server" class="btn btn-warning btn-sm" accept=".jpg, .jpeg" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="rfper6" runat="server" ErrorMessage="*" ControlToValidate="fuppi" ValidationGroup="personas" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegularExpressionValidator3" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fuppi" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Foto: Tarjeta SEGIP o Documento</div>
                        <asp:FileUpload ID="fuppd" runat="server" class="btn btn-warning btn-sm" accept=".jpg, .jpeg" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="rfper7" runat="server" ErrorMessage="*" ControlToValidate="fuppd" ValidationGroup="personas" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegularExpressionValidator4" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fuppd" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                        &nbsp;                        
                    </div>
                    <div class="flex">
                        <asp:Button ID="Button2" runat="server" Text="Agregar Personas" class="btn btn-danger" OnClick="Button2_Click" Width="180px" ValidationGroup="personas" OnClientClick="javascript:showAlerguarda();"/>                      
                    </div>
                </div>                
            </div>
            <br />
            <asp:GridView ID="GridView6" runat="server" AutoGenerateColumns="False" Font-Size="X-Small" Width="100%" OnRowDeleting="GridView6_RowDeleting">
                 <Columns>
                     <asp:BoundField DataField="Det1" HeaderText="Cod. Id." />
                     <asp:BoundField DataField="Det2" HeaderText="Nombre y Apellidos" />
                     <asp:BoundField DataField="Det3" HeaderText="Nacionalidad" />
                     <asp:BoundField DataField="Det4" HeaderText="Genero" />
                     <asp:BoundField DataField="Det5" HeaderText="Tipo de Documento" />
                     <asp:BoundField DataField="Det6" HeaderText="Numero de Documento" />
                     <asp:BoundField DataField="Det7" HeaderText="Fecha Nac." />
                     <asp:BoundField DataField="Det8" HeaderText="Direccion" />
                     <asp:BoundField DataField="Det9" HeaderText="Estado" />
                     <asp:TemplateField HeaderText="Frente">                                    
                         <ItemTemplate>
                             <asp:Image ID="imgdet1" runat="server" Height="284px" Width="240px" ImageUrl='<%# Eval("Det1", "~/Forms/ImageDetDB1.ashx?Id={0}") %>'/>
                         </ItemTemplate>
                     </asp:TemplateField>
                     <asp:TemplateField HeaderText="Perfil Izquierdo">                                     
                         <ItemTemplate>
                             <asp:Image ID="imgdet2" runat="server" Height="284px" Width="240px" ImageUrl='<%# Eval("Det1", "~/Forms/ImageDetDB2.ashx?Id={0}") %>'/>
                         </ItemTemplate>
                     </asp:TemplateField>
                     <asp:TemplateField HeaderText="FOTO: Tarjeta SEGIP o Documento">                                     
                         <ItemTemplate>
                             <asp:Image ID="imgdet3" runat="server" Height="266px" Width="554px" ImageUrl='<%# Eval("Det1", "~/Forms/ImageDetDB3.ashx?Id={0}") %>'/>
                         </ItemTemplate>
                     </asp:TemplateField>
                     <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                 </Columns>
             </asp:GridView>  
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">BIENES U OBJETOS SECUESTRADOS</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Bien</div>
                        <asp:DropDownList ID="cbobien" runat="server" class="form-select form-select-sm text-white-dark" Width="200px" AutoPostBack="True" OnSelectedIndexChanged="cbobien_SelectedIndexChanged"></asp:DropDownList>
                        &nbsp;
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Clase</div>
                        <asp:DropDownList ID="cboclase" runat="server" class="form-select form-select-sm text-white-dark" Width="250px" AutoPostBack="True" OnSelectedIndexChanged="cboclase_SelectedIndexChanged"></asp:DropDownList>
                        &nbsp;
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo</div>
                        <asp:DropDownList ID="cbotipo" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                     </div>   
                     <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Cantidad</div>
                        <asp:TextBox ID="txtcantbien" runat="server" placeholder="" class="form-input form-input-sm" Width="100px"></asp:TextBox>
                        &nbsp;
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">En investigacion?</div>
                        <asp:DropDownList ID="cboinvest" runat="server" class="form-select form-select-sm text-white-dark" Width="70px">
                            <asp:ListItem Value="1">SI</asp:ListItem>
                            <asp:ListItem Value="0">NO</asp:ListItem>
                        </asp:DropDownList>
                        &nbsp;
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fotografia</div>
                        <asp:FileUpload ID="fupbien" runat="server" class="btn btn-warning btn-sm" accept=".jpg, .jpeg" x-tooltip="Solo se Permite archivos JPG o JPEG"/>&nbsp;
                        &nbsp;
                        <asp:Button ID="btnaddbien" runat="server" Text="Agregar Bien" class="btn btn-danger" Width="120px" OnClick="btnaddbien_Click" OnClientClick="javascript:showAlerguarda();"/>
                    </div>
                </div>
                <br />                
            </div>
            <br />
            <asp:GridView ID="GridView7" runat="server" AutoGenerateColumns="False" OnRowDeleting="GridView7_RowDeleting"
                OnSelectedIndexChanged="GridView7_SelectedIndexChanged" Width="100%">
                <Columns>
                    <asp:BoundField DataField="bien1" HeaderText="Id" />
                    <asp:BoundField DataField="bien2" HeaderText="Catalogo Bien" />
                    <asp:BoundField DataField="bien3" HeaderText="Catalogo Clase" />
                    <asp:BoundField DataField="bien4" HeaderText="Tipo" />
                    <asp:BoundField DataField="bien5" HeaderText="Cantidad Bien" />
                    <asp:BoundField DataField="bien6" HeaderText="En Investigacion" />
                    <asp:CommandField SelectText="Agregar Caracteristicas" ShowSelectButton="True" />
                    <asp:CommandField ButtonType="Image" DeleteImageUrl="~/assets/images/basura.png" ShowDeleteButton="True" />
                </Columns>
            </asp:GridView>
            <br />
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <asp:Label ID="LblIdcatalogo" runat="server" Text="" Visible="False"></asp:Label>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Descripcion</div>
                        <asp:DropDownList ID="cbocaracteristica" runat="server" class="form-select form-select-sm text-white-dark" Width="200px"></asp:DropDownList>
                        &nbsp;                        
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Caracteristica</div>
                        <asp:TextBox ID="txtcaracteristica" runat="server" placeholder="" class="form-input form-input-sm" Width="300px"></asp:TextBox>
                        &nbsp;
                        <asp:Button ID="btnactcaract" runat="server" Text="Agregar Caracteristica" class="btn btn-danger" Width="180px" OnClick="btnactcaract_Click" OnClientClick="javascript:showAlerguarda();"/>
                    </div>
                </div>             
            </div>
            <br />
            <asp:GridView ID="GridView8" runat="server" AutoGenerateColumns="False" OnRowDeleting="GridView8_RowDeleting" Width="100%">
                <Columns>
                    <asp:BoundField DataField="carac1" HeaderText="Id" />
                    <asp:BoundField DataField="carac2" HeaderText="Caracteristica" />
                    <asp:BoundField DataField="carac3" HeaderText="Descripcion" />
                    <asp:CommandField ButtonType="Image" DeleteImageUrl="~/assets/images/basura.png" ShowDeleteButton="True" />
                </Columns>
            </asp:GridView>
            <br />
            <asp:GridView ID="GridBienes" runat="server" AutoGenerateColumns="False" Width="100%" DataKeyNames="bien1" OnRowDataBound="GridBienes_RowDataBound" BorderStyle="Dashed" BorderColor="Black">
                <Columns>
                    <asp:BoundField DataField="bien1" HeaderText="Catalogo Bien" Visible="False" />
                    <asp:BoundField DataField="bien2" HeaderText="Catalogo Bien" />
                    <asp:BoundField DataField="bien3" HeaderText="Catalogo Clase" />
                    <asp:BoundField DataField="bien4" HeaderText="Tipo" />
                    <asp:BoundField DataField="bien5" HeaderText="Cantidad Bien" />
                    <asp:TemplateField HeaderText="Fotografia del Bien">                                    
                        <ItemTemplate>
                            <asp:Image ID="imgdet1" runat="server" Height="360px" Width="550px" ImageUrl='<%# Eval("bien1", "~/Forms/bien.ashx?Id={0}") %>'/>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField>
                        <ItemTemplate>
                            <table style="width: 100%;">
                                <tr>
                                    <td>
                                        <asp:GridView ID="GridSubBienes" runat="server" AutoGenerateColumns="False" Width="100%" BorderStyle="Dashed" BorderColor="Black">                                            
                                            <Columns>
                                                <asp:BoundField DataField="carac1" HeaderText="Id" Visible="False" />
                                                <asp:BoundField DataField="carac2" HeaderText="Caracteristica" />
                                                <asp:BoundField DataField="carac3" HeaderText="Descripcion" />
                                            </Columns>                                            
                                        </asp:GridView>
                                    </td>
                                </tr>
                            </table>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
            </asp:GridView>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">GALERIA FOTOGRAFICA DEL OPERATIVO</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">                    
                     <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Descripcion</div>
                        <asp:TextBox ID="txtdescfoto" runat="server" placeholder="" class="form-input form-input-sm" Width="200px"></asp:TextBox>
                         <asp:RequiredFieldValidator ID="rfvalgal1" runat="server" ErrorMessage="*" ControlToValidate="txtdescfoto" ValidationGroup="galeria" ForeColor="Red"></asp:RequiredFieldValidator>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tamaño de Foto</div>
                        <asp:DropDownList ID="ddlgaleriatam" runat="server" class="form-select form-select-sm text-white-dark" Width="170px">
                            <asp:ListItem Value="1">Fotografia Horizontal</asp:ListItem>
                            <asp:ListItem Value="0">Fotografia Vertical</asp:ListItem>
                        </asp:DropDownList>
                        &nbsp;
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Archivo</div>
                        <asp:FileUpload ID="fupgaleria" runat="server" class="btn btn-warning btn-sm" accept=".jpg, .jpeg" x-tooltip="Solo se Permite archivos JPG o JPEG"/>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="*" ControlToValidate="fupgaleria" ValidationGroup="galeria" ForeColor="Red" Display="Dynamic"></asp:RequiredFieldValidator>
                        <asp:RegularExpressionValidator ID="RegularExpressionValidator1" ValidationExpression="([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg)$" ControlToValidate="fupgaleria" runat="server" ForeColor="Red" ErrorMessage="Seleccione Archivo JPG o JPEG" Display="Dynamic" />
                         &nbsp;
                        &nbsp;
                        <asp:Button ID="btngaleria" runat="server" Text="Agregar a Galeria" class="btn btn-danger" Width="170px" ValidationGroup="galeria" OnClick="btngaleria_Click" OnClientClick="javascript:showAlerguarda();"/>
                    </div>
                </div>
            </div>
            <br />
            <asp:GridView ID="Gridgaleria" runat="server" AutoGenerateColumns="False" Font-Size="X-Small" Width="100%" OnRowDeleting="Gridgaleria_RowDeleting">
                <Columns>
                    <asp:BoundField DataField="gal1" HeaderText="Cod. Id." />
                    <asp:BoundField DataField="gal2" HeaderText="Descripcion" />
                    <asp:TemplateField HeaderText="Fotografia">
                        <ItemTemplate>
                            <asp:Image ID="Image2" runat="server" ImageUrl='<%# Eval("gal1", "~/Forms/ImageGaleria.ashx?Id={0}") %>' />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                </Columns>
            </asp:GridView>
        </div>
         <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">FINAL DEL FORMULARIO</h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <center><asp:Button ID="btnsalir" runat="server" Text="Guardar y Salir" class="btn btn-danger" Width="170px" OnClick="btnsalir_Click" OnClientClick="javascript:showAlerguarda();"/></center>
                    </div>
                </div>
                <br />
            </div>
        </div>
</asp:Content>
