<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" MaintainScrollPositionOnPostback="true" AutoEventWireup="true" CodeFile="FRM-JUR-01.aspx.cs" Inherits="Forms_FRM_JUR_01" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="animate__animated p-6">
        <div x-data="sales">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">FORMULARIO JURIDICO 1: ACTUALIZACION DE CASOS</a></li>
            </ol>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">ACTUALIZACION DEL INFORME
                    <asp:Label ID="lblidcaso" runat="server" Visible="False"></asp:Label>
                </h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Caso</div>
                        <asp:Label ID="txtnrocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Operativo</div>
                        <asp:Label ID="txtnroop" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre del Caso</div>
                        <asp:Label ID="txtnombrecaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Asignado al Caso</div>
                        <asp:Label ID="txtasignadocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fiscal Asignado</div>
                        <asp:Label ID="txtfiscalasignado" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Num. Caso Perdida de Dominio</div>
                        <asp:Label ID="txtperdom" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Actualizar A:</div>
                        <asp:TextBox ID="txtperdomact" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btnactperdom" runat="server" Text="Actualizar" class="btn btn-primary btn-sm" OnClick="btnactperdom_Click" />
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">CUD Fiscalia</div>
                        <asp:Label ID="lblcud" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Actualizar A:</div>
                        <asp:TextBox ID="txtcud" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btnactcud" runat="server" Text="Actualizar" class="btn btn-info btn-sm" OnClick="btnactcud_Click" />
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Etapa investigativa</div>
                        <asp:Label ID="lbletapa" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Actualizar A:</div>
                        <asp:DropDownList ID="cboetapa" runat="server" class="form-select form-select-sm text-white-dark" Width="300px"></asp:DropDownList>
                    </div>
                    <div class="flex">
                        <asp:Button ID="btnactetapa" runat="server" Text="Actualizar" class="btn btn-success btn-sm" OnClick="btnactetapa_Click" />
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Informe del Caso</div>
                        <asp:TextBox ID="txtdetallehecho" runat="server" placeholder="" class="form-input form-input-sm" Width="100%" Height="450px" TextMode="MultiLine"></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <asp:Button ID="btnactinforme" runat="server" Text="Actualizar Informe" class="btn btn-secondary btn-sm" OnClick="btnactinforme_Click" />
                    </div>
                </div>
            </div>
        </div>
        <asp:Label ID="lblidoperativo" runat="server" Visible="False"></asp:Label>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">BASE DE DATOS DOCUMENTAL DEL CASO (CUADERNO DE INVESTIGACION DIGITAL)</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0">PASO 1: Seleccionar Documento
                            </th>
                            <th class="head1">Paso 2: Nombre de Documento
                            </th>
                            <th class="head1">Paso 3: Tipo</th>
                            <th class="head0">Paso 4: Seleccionar Documento</th>
                            <th class="head1">Paso 5: Finalizar Guardando los archivos</th>
                        </tr>
                    </thead>
                    <tfoot>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td>
                                <asp:DropDownList ID="Ddldescrip" runat="server" class="form-select form-select-sm text-white-dark">
                                </asp:DropDownList>
                            </td>
                            <td>
                                <asp:TextBox ID="txtnombredoc" runat="server" placeholder="" class="form-input form-input-sm" Width="250px"></asp:TextBox>
                            </td>
                            <td>
                                <asp:DropDownList ID="ddltipodocumento" runat="server" class="form-select form-select-sm text-white-dark">
                                    <asp:ListItem>DOCUMENTO</asp:ListItem>
                                    <asp:ListItem>IMAGEN</asp:ListItem>
                                    <asp:ListItem>VIDEO</asp:ListItem>
                                    <asp:ListItem>AUDIO</asp:ListItem>
                                </asp:DropDownList>
                            </td>
                            <td>
                                <asp:FileUpload ID="fudocum" runat="server" class="btn btn-warning btn-sm" x-tooltip="Selecccionar un Archivo"/>
                            </td>
                            <td>
                                <asp:Button ID="btnarchivo" runat="server" Text="Subir Archivo" class="btn btn-success btn-sm" OnClick="btnarchivo_Click"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="griddocum" runat="server" AutoGenerateColumns="False" Width="100%" OnRowDeleting="griddocum_RowDeleting">
                    <Columns>
                        <asp:BoundField DataField="Id" HeaderText="Id" />
                        <asp:BoundField DataField="A1" HeaderText="Documento" />
                        <asp:BoundField DataField="A2" HeaderText="Tipo" />
                        <asp:BoundField DataField="A3" HeaderText="Nombre del Documento" />
                        <asp:BoundField DataField="A4" HeaderText="Nombre de Archivo" />
                        <asp:TemplateField ItemStyle-HorizontalAlign="Center">
                            <ItemTemplate>
                                <asp:LinkButton ID="lnkDownload" runat="server" Text="Descargar" OnClick="DownloadFile" CommandArgument='<%# Eval("Id") %>'></asp:LinkButton>
                            </ItemTemplate>
                            <ItemStyle HorizontalAlign="Center"></ItemStyle>
                        </asp:TemplateField>
                        <asp:CommandField ButtonType="Image" DeleteImageUrl="~/assets/images/icons8-basura-24.png" ShowDeleteButton="True" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">SERVIDORES POLICIALES QUE INTERVIENEN EN EL OPERATIVO</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <colgroup>
                        <col class="con0" />
                        <col class="con1" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="head0" style="width: 140px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tfoot>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td style="width: 140px">Grado:</td>
                            <td>
                                <asp:DropDownList ID="ddlservpol" runat="server" class="form-select form-select-sm text-white-dark" Width="250px">
                                </asp:DropDownList>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 140px">Nombre y Apellidos:</td>
                            <td>
                                <asp:TextBox ID="TextBox1" runat="server" Width="450px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 140px">&nbsp;
                            </td>
                            <td>
                                <asp:Button ID="btnservpoladd" runat="server" Font-Bold="True" Text="GUARDAR" OnClick="btnservpoladd_Click" class="btn btn-warning btn-sm"/>                                
                            </td>
                        </tr>                        
                    </tbody>
                </table>
                <br />
                <div class="table-responsive">
                    <asp:GridView ID="gridservpol" runat="server" AutoGenerateColumns="False" Width="100%" class="table-hover table-striped whitespace-nowrap">
                        <Columns>
                            <asp:BoundField DataField="sp1" HeaderText="Id" />
                            <asp:BoundField DataField="sp2" HeaderText="Grado" />
                            <asp:BoundField DataField="sp3" HeaderText="Nombre y Apellidos" />                        
                        </Columns>
                        <HeaderStyle HorizontalAlign="Left" VerticalAlign="Middle" />
                        <RowStyle HorizontalAlign="Left" VerticalAlign="Middle" />
                    </asp:GridView>
                </div>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">JURISDICCION DEL CASO</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="w-1\/5" style="width: 141px">Informacion
                            </th>
                            <th class="head1" style="width: 91%">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>                    
                    <tbody>
                        <tr>
                            <td class="w-1\/5" style="width: 141px">Fecha del Operativo</td>
                            <td style="width: 91%">
                                <asp:TextBox ID="txtfechajuris" runat="server" Width="150px" placeholder="" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td class="w-1\/5" style="width: 141px">Jurisdiccion
                            </td>
                            <td style="width: 91%">
                                <asp:TextBox ID="txtjuris" runat="server" Width="450px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td class="w-1\/5" style="width: 141px">Observacion
                            </td>
                            <td style="width: 91%">
                                <asp:TextBox ID="txtobsjuris" runat="server" Width="550px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td class="w-1\/5" style="width: 141px">&nbsp;
                            </td>
                            <td style="width: 91%">
                                <asp:Button ID="btnjurisd" runat="server" Font-Bold="True" Text="GUARDAR" class="btn btn-warning btn-sm" OnClick="btnjurisd_Click"/>                               
                            </td>
                        </tr>                        
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridjuris" runat="server" AutoGenerateColumns="False" Width="100%" class="table-hover table-striped whitespace-nowrap">
                    <Columns>
                        <asp:BoundField DataField="Jur1" HeaderText="Id" />
                        <asp:BoundField DataField="Jur2" HeaderText="Fecha de Asignacion" DataFormatString="{0:D}" />
                        <asp:BoundField DataField="Jur3" HeaderText="Jurisdiccion" />
                        <asp:BoundField DataField="Jur4" HeaderText="Observacion" />
                        <asp:BoundField DataField="Jur5" HeaderText="Estado" />                        
                    </Columns>
                    <HeaderStyle HorizontalAlign="Left" VerticalAlign="Middle" />
                    <RowStyle HorizontalAlign="Left" VerticalAlign="Middle" />
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">CONTROL JURISDICCIONAL</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">                    
                    <thead>
                        <tr>
                            <th class="head0" style="width: 326px">Informacion
                            </th>
                            <th class="head1" style="width: 79%">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>                   
                    <tbody>
                        <tr>
                            <td style="width: 326px; height: 24px;">Fecha de Inicio de la investigacion</td>
                            <td style="width: 79%; height: 24px;">
                                <asp:TextBox ID="txtfechaini" runat="server" Width="150px" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 326px">Juzgado de Instrucción en lo Penal y/o Cautelar</td>
                            <td style="width: 79%">
                                <asp:TextBox ID="txtjuzgado" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 326px">Juzgado Mixto</td>
                            <td style="width: 79%">
                                <asp:TextBox ID="txtjuzmixto" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 326px">Tribunal de Sentencia en lo Penal</td>
                            <td style="width: 79%">
                                <asp:TextBox ID="txttribunalsen" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 326px">Juzgado de Ejecución en lo Penal Actual</td>
                            <td style="width: 79%">
                                <asp:TextBox ID="txtjuzejepenal" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 326px">
                                &nbsp;
                            </td>
                            <td style="width: 79%">
                                <asp:Button ID="btncontroljur" runat="server" Font-Bold="True" Text="GUARDAR" class="btn btn-warning btn-sm" OnClick="btncontroljur_Click"/>                              
                            </td>
                        </tr>                       
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridcontroljuris" runat="server" AutoGenerateColumns="False" Width="100%" class="table-hover table-striped whitespace-nowrap">
                    <Columns>
                        <asp:BoundField DataField="Cj1" HeaderText="Id" />
                        <asp:BoundField DataField="Cj2" HeaderText="Fecha de Asignacion" DataFormatString="{0:D}" />
                        <asp:BoundField DataField="Cj3" HeaderText="Juzgado de instrucción en lo penal" />
                        <asp:BoundField DataField="Cj4" HeaderText="Juzgado de partido en lo penal" />
                        <asp:BoundField DataField="Cj5" HeaderText="Tribunal de Sentencia en lo penal" />
                        <asp:BoundField DataField="Cj6" HeaderText="Juzgado de ejecución en lo penal" />
                        <asp:BoundField DataField="Cj7" HeaderText="Estado" />                        
                    </Columns>
                    <HeaderStyle HorizontalAlign="Left" VerticalAlign="Middle" />
                    <RowStyle HorizontalAlign="Left" VerticalAlign="Middle" />
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">INVESTIGADOR (ES) ASIGNADO (S) AL CASO</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 149px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tfoot>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td>Grado</td>
                            <td>
                                <asp:DropDownList ID="ddlgrado" runat="server" class="form-select form-select-sm text-white-dark" Width="250px">
                                </asp:DropDownList>
                            </td>
                        </tr>
                        <tr>
                            <td>Investigador</td>
                            <td>
                                <asp:TextBox ID="txtinvestigador" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td>Numero Celular</td>
                            <td>
                                <asp:TextBox ID="txtnrocel" runat="server" Width="150px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td>Numero Fijo de la Unidad</td>
                            <td>
                                <asp:TextBox ID="txtnrofijo" runat="server" Width="150px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td>Fecha de Asignacion al caso</td>
                            <td>
                                <asp:TextBox ID="txtfechaasignacion" runat="server" Width="150px" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 149px">&nbsp;</td>
                            <td>
                                <asp:Button ID="btnasignado" runat="server" Font-Bold="True" Text="GUARDAR" class="btn btn-warning btn-sm" OnClick="btnasignado_Click"/>
                                
                            </td>
                        </tr>                        
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridinvestigador" runat="server" AutoGenerateColumns="False" Width="100%" >
                    <Columns>
                        <asp:BoundField DataField="In1" HeaderText="Id" />
                        <asp:BoundField DataField="In2" HeaderText="Grado" />
                        <asp:BoundField DataField="In3" HeaderText="Nombre y Apellidos" />
                        <asp:BoundField DataField="In4" HeaderText="Fecha de Asignacion" DataFormatString="{0:D}" />
                        <asp:BoundField DataField="In5" HeaderText="Tel. Celular" />
                        <asp:BoundField DataField="In6" HeaderText="Tel. Fijo" />
                        <asp:BoundField DataField="In7" HeaderText="Estado" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">FISCAL (ES) ASIGNADO (S) AL CASO</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 202px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tfoot>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td style="width: 202px">Nombre y Apellidos</td>
                            <td>
                                <asp:TextBox ID="txtfisnomb" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 202px">Telefono Celular</td>
                            <td>
                                <asp:TextBox ID="txtfiscel" runat="server" Width="150px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 202px">Telefono Fijo de la Oficina</td>
                            <td>
                                <asp:TextBox ID="txtfisofi" runat="server" Width="150px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 202px">Fecha de Asignacion al caso</td>
                            <td>
                                <asp:TextBox ID="txtfisfechaasig" runat="server" Width="150px" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 202px">                                
                            </td>
                            <td>
                                <asp:Button ID="btnfiscal" runat="server" Text="GUARDAR" class="btn btn-warning btn-sm" OnClick="btnfiscal_Click" />
                            </td>
                        </tr>                        
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="GridView5" runat="server" AutoGenerateColumns="False" Width="100%">
                    <Columns>
                        <asp:BoundField DataField="Fis1" HeaderText="Id" />
                        <asp:BoundField DataField="Fis2" HeaderText="Nombre y Apellidos" />
                        <asp:BoundField DataField="Fis3" HeaderText="Fecha de Asignacion" DataFormatString="{0:D}" />
                        <asp:BoundField DataField="Fis4" HeaderText="Tel. Celular" />
                        <asp:BoundField DataField="Fis5" HeaderText="Tel. Fijo" />
                        <asp:BoundField DataField="Fis6" HeaderText="Estado" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>        
    </div>
</asp:Content>
