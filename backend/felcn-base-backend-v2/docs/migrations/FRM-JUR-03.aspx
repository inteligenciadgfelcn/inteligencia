<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" AutoEventWireup="true" CodeFile="FRM-JUR-03.aspx.cs" Inherits="Forms_FRM_JUR_03" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="animate__animated p-6">
        <div x-data="sales">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">FORMULARIO JURIDICO 2: SITUACION JURDICA DE PERSONAS</a></li>
            </ol>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">INFORMACION DEL CASO
                <asp:Label ID="lblidcaso" runat="server" Visible="False"></asp:Label>
                </h5>
            </div>
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Caso</div>
                        <asp:Label ID="txtnrocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Operativo</div>
                        <asp:Label ID="txtnroop" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre del Caso</div>
                        <asp:Label ID="txtnombrecaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="250px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Asignado al Caso</div>
                        <asp:Label ID="txtasignadocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fiscal Asignado</div>
                        <asp:Label ID="txtfiscalasignado" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Num. Caso Perdida de Dominio</div>
                        <asp:Label ID="txtperdom" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">CUD Fiscalia</div>
                        <asp:Label ID="lblcud" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Etapa investigativa</div>
                        <asp:Label ID="lbletapa" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                    </div>
                </div>
                <br />
                <asp:GridView ID="gridbien" runat="server" AutoGenerateColumns="False" Width="100%" DataKeyNames="bien1" OnRowDataBound="gridbien_RowDataBound" CellPadding="4" ForeColor="#333333" Font-Size="Small" OnSelectedIndexChanged="gridbien_SelectedIndexChanged">
                    <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                    <Columns>
                        <asp:BoundField DataField="bien1" HeaderText="Catalogo Bien" />
                        <asp:BoundField DataField="bien2" HeaderText="Catalogo Bien" />
                        <asp:BoundField DataField="bien3" HeaderText="Catalogo Clase" />
                        <asp:BoundField DataField="bien4" HeaderText="Tipo" />
                        <asp:BoundField DataField="bien5" HeaderText="Cantidad Bien" />
                        <asp:TemplateField HeaderText="Fotografia del Bien">
                            <ItemTemplate>
                                <asp:Image ID="imgdet1" runat="server" Height="120px" Width="160px" ImageUrl='<%# Eval("bien1", "~/Forms/bien.ashx?Id={0}") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Caracteristicas del Bien">
                            <ItemTemplate>
                                <table style="width: 100%;">
                                    <tr>
                                        <td>
                                            <asp:GridView ID="gridcaracteristicas" runat="server" AutoGenerateColumns="False" Width="100%" CssClass="ChildGrid" CellPadding="1" CellSpacing="1" ForeColor="#333333">
                                                <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                                                <Columns>
                                                    <asp:BoundField DataField="carac1" HeaderText="Id" Visible="False" />
                                                    <asp:BoundField DataField="carac2" HeaderText="" />
                                                    <asp:BoundField DataField="carac3" HeaderText="" />
                                                </Columns>
                                                <EditRowStyle BackColor="#999999" />
                                                <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                                                <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                                                <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                                                <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                                                <SortedAscendingCellStyle BackColor="#E9E7E2" />
                                                <SortedAscendingHeaderStyle BackColor="#506C8C" />
                                                <SortedDescendingCellStyle BackColor="#FFFDF8" />
                                                <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
                                            </asp:GridView>
                                        </td>
                                    </tr>
                                </table>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField ShowHeader="False">
                            <ItemTemplate>
                                <asp:Button ID="Button1" runat="server" CausesValidation="False" CommandName="Select" Text="Habiltar Situacion Juridica" class="btn btn-dark btn-sm" />
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                    <EditRowStyle BackColor="#999999" />
                    <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                    <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                    <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                    <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                    <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                    <SortedAscendingCellStyle BackColor="#E9E7E2" />
                    <SortedAscendingHeaderStyle BackColor="#506C8C" />
                    <SortedDescendingCellStyle BackColor="#FFFDF8" />
                    <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
                </asp:GridView>
            </div>
        </div>
        <asp:Label ID="lblidoperativo" runat="server" Visible="False"></asp:Label>
        <asp:Label ID="LblIdBien" runat="server" Visible="False"></asp:Label>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">BIENES SECUESTRADOS</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 403px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width: 403px">Nombres y Apellidos del Fiscal </td>
                            <td>
                                <asp:TextBox ID="txtsecfiscal" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 403px">Fecha del Acta del Secuestro</td>
                            <td>
                                <asp:TextBox ID="txtsecfechasec" runat="server" Width="150px" placeholder="" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 403px">Nombre y Apellidos del Investigador que secuestro el Bien</td>
                            <td>
                                <asp:TextBox ID="txtsecinvestig" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 403px"></td>
                            <td>
                                <asp:Button ID="btnsecuestro" runat="server" Text="Guardar Informacion" class="btn btn-success btn-sm" OnClick="btnsecuestro_Click" /></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridsecuestrado" runat="server" AutoGenerateColumns="False"
                    Width="100%">
                    <Columns>
                        <asp:BoundField DataField="BS1" HeaderText="Id" />
                        <asp:BoundField DataField="BS3" HeaderText="Fiscal" />
                        <asp:BoundField DataField="BS4" HeaderText="Fecha del Acta de Secuestrao"
                            DataFormatString="{0:D}" />
                        <asp:BoundField DataField="BS5"
                            HeaderText="Investigador que Secuestro el Bien" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">BIENES INCAUTADOS</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 485px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width: 485px">Numero de Resolucion Judicial</td>
                            <td><asp:TextBox ID="txtincaresol" runat="server" Width="150px" placeholder="" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 485px">Fecha de la Resolucion Judicial</td>
                            <td><asp:TextBox ID="txtincafecha" runat="server" Width="150px" placeholder="" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 485px">Nombres y Apellidos y Cargo de la Autoridad que Emite la Resolucion</td>
                            <td><asp:TextBox ID="txtincaautoridad" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 485px">&nbsp;</td>
                            <td>
                                <asp:Button ID="btnincautado" runat="server" Text="Guardar Informacion" class="btn btn-success btn-sm" OnClick="btnincautado_Click" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridincautado" runat="server" AutoGenerateColumns="False" Width="100%">
                    <Columns>
                        <asp:BoundField DataField="BI1" HeaderText="Id" />
                        <asp:BoundField DataField="BI2" HeaderText="Numero de Resolucion Judicial" />
                        <asp:BoundField DataField="BI3" DataFormatString="{0:D}"
                            HeaderText="Fecha de la Resolucion Judicial" />
                        <asp:BoundField DataField="BI4"
                            HeaderText="Autoridad que Emite la Resolucion" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">BIENES CONFISCADOS</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 478px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tfoot>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td style="width: 478px">Numero de Sentencia Judicial</td>
                            <td><asp:TextBox ID="txtconfissentencia" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 478px">Fecha de la Sentencia Judicial</td>
                            <td><asp:TextBox ID="txtconfisfecha" runat="server" placeholder="" class="form-input form-input-sm" Width="150px" x-tooltip="Ej: 25/11/2025"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 478px">Nombres y Apellidos y Cargo de la Autoridad que Emite la Sentencia</td>
                            <td><asp:TextBox ID="txtconfisautoridad" runat="server" placeholder="" class="form-input form-input-sm" Width="350px"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 478px"></td>
                            <td>
                                <asp:Button ID="btnconfiscado" runat="server" Text="Guardar Informacion" class="btn btn-success btn-sm" OnClick="btnconfiscado_Click"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="GridView9" runat="server" AutoGenerateColumns="False"
                    Width="100%">
                    <Columns>
                        <asp:BoundField DataField="BC1" HeaderText="Id" />
                        <asp:BoundField DataField="BC2" HeaderText="Numero de Sentencia Judicial" />
                        <asp:BoundField DataField="BC3" DataFormatString="{0:D}" HeaderText="Fecha de la Sentencia Judicial" />
                        <asp:BoundField DataField="BC4" HeaderText="Autoridad que Emite la Sentencia" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">PERDIDA DE DOMINIO</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 293px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width: 293px">Fiscalia que emitio la Perdida de Dominio</td>
                            <td>
                                <asp:TextBox ID="txtpdfiscalia" runat="server" Width="350px" placeholder="" class="form-input form-input-sm" ></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 293px">Fecha</td>
                            <td>
                                <asp:TextBox ID="txtpdfecha" runat="server" Width="150px" placeholder="" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 293px">A Requerimiento del Fiscal</td>
                            <td>
                                <asp:TextBox ID="txtpdrequerim" runat="server" Width="350px" placeholder="" class="form-input form-input-sm" ></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 293px">&nbsp;</td>
                            <td>
                                <asp:Button ID="btnperdidadom" runat="server" Text="Guardar Informacion" class="btn btn-success btn-sm" OnClick="btnperdidadom_Click" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridperdidadom" runat="server" AutoGenerateColumns="False"
                    Width="100%">
                    <Columns>
                        <asp:BoundField DataField="PD1" HeaderText="Id" />
                        <asp:BoundField DataField="PD2" HeaderText="Fiscalia que emitio la Perdidad de Dominio" />
                        <asp:BoundField DataField="PD3" DataFormatString="{0:D}" HeaderText="Fecha" />
                        <asp:BoundField DataField="PD4" HeaderText="Autoridad que Emite la Sentencia" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">ENTREGA O DEVOLUCION DEL BIEN</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 506px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width: 506px">Fecha del Requerimiento Fiscal de Entrega o Devolucion del Bien</td>
                            <td>
                                <asp:TextBox ID="txtentfecha" runat="server" Width="150px" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Nombres y Apellidos del Fiscal que emite el requerimiento</td>
                            <td>
                                <asp:TextBox ID="txtentfiscal" runat="server" Width="550px" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Condicion Legal de la Entrega del Bien</td>
                            <td>
                                <asp:DropDownList ID="DropDownList2" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList></td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Fecha de Entrega del Bien</td>
                            <td>
                                <asp:TextBox ID="txtentfechabien" runat="server" Width="150px" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Nombres y Apellidos&nbsp; y Cargo del Responsable de la Entrega del Bien</td>
                            <td>
                                <asp:TextBox ID="txtentpersonal" runat="server" Width="350px" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Nombres y Apellidos&nbsp; y Cargo del Responsable de la Recepcion del Bien</td>
                            <td>
                                <asp:TextBox ID="txtentrecibe" runat="server" Width="350px" class="form-input form-input-sm"></asp:TextBox></td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Institucion Responsable del Bien </td>
                            <td>
                                <asp:TextBox ID="txtentinstitucion" runat="server" Width="350px" class="form-input form-input-sm"></asp:TextBox>
                                &nbsp;(Ej. DIRCABI, Min. Defenza, MIN. Publico, Personas Naturales o Juridicas)</td>
                        </tr>
                        <tr>
                            <td style="width: 506px">Ubicacion Fisica del Bien </td>
                            <td>
                                <asp:TextBox ID="txtentubicacion" runat="server" Width="450px" class="form-input form-input-sm"></asp:TextBox>
                                &nbsp;(Departamento, Provincia, Localidad o Ciudad, Direccion y Numeracion)</td>
                        </tr>
                        <tr>
                            <td style="width: 506px"></td>
                            <td>
                                <asp:Button ID="btnentrega" runat="server" Font-Bold="True" Text="GUARDAR" class="btn btn-warning btn-sm" OnClick="btnentrega_Click" /></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridentrega" runat="server" AutoGenerateColumns="False"
                    Width="100%">
                    <Columns>
                        <asp:BoundField DataField="SitB1" HeaderText="Id" />
                        <asp:BoundField DataField="SitB"  DataFormatString="{0:D}" HeaderText="Fecha Req. Fiscal O dev. del Bien" />
                        <asp:BoundField DataField="SitB0" HeaderText="Fiscal" />
                        <asp:BoundField DataField="SitB7" DataFormatString="{0:D}" HeaderText="Fecha de la entrega del Bien" />
                        <asp:BoundField DataField="SitB8" HeaderText="Responsable de la Entrega del Bien" />
                        <asp:BoundField DataField="SitB9" HeaderText="Responsable de la Recepción del Bien" />
                        <asp:BoundField DataField="SitB10" HeaderText="Institución Responsable del Bien" />
                        <asp:BoundField DataField="SitB11" HeaderText="Ubicación Física del Bien" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">ENTREGA O DEVOLUCION DEL BIEN</h5>
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
                                <asp:DropDownList ID="Ddldescrip" runat="server" class="form-select form-select-sm text-white-dark" Width="150px">
                                </asp:DropDownList>
                            </td>
                            <td>
                                <asp:TextBox ID="txtnombredoc" runat="server" EnableTheming="True" Width="250px" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                            <td>
                                <asp:DropDownList ID="ddltipodocumento" runat="server" class="form-select form-select-sm text-white-dark">
                                    <asp:ListItem>DOCUMENTO</asp:ListItem>
                                    <asp:ListItem>IMAGEN</asp:ListItem>
                                </asp:DropDownList>
                            </td>
                            <td>
                                <asp:FileUpload ID="fudocum" runat="server" class="btn btn-warning btn-sm" />
                            </td>
                            <td>
                                <asp:Button ID="btnentregaarchivo" runat="server" OnClick="btnentregaarchivo_Click" Text="Finalizar Ingreso" class="btn btn-warning btn-sm"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="gridbdbienes" runat="server" AutoGenerateColumns="False"
                    Width="100%" OnRowDeleting="gridbdbienes_RowDeleting">
                    <Columns>
                        <asp:BoundField DataField="Id" HeaderText="Id" />
                        <asp:BoundField DataField="A1" HeaderText="Documento" />
                        <asp:BoundField DataField="A2" HeaderText="Tipo" />
                        <asp:BoundField DataField="A3" HeaderText="Nombre del Documento" />
                        <asp:BoundField DataField="A4" HeaderText="Nombre de Archivo" />
                        <asp:TemplateField ItemStyle-HorizontalAlign="Center">
                            <ItemTemplate>
                                <asp:LinkButton ID="lnkDownload" runat="server" Text="Descargar" OnClick="DownloadFile"
                                    CommandArgument='<%# Eval("Id") %>'></asp:LinkButton>
                            </ItemTemplate>
                            <ItemStyle HorizontalAlign="Center"></ItemStyle>
                        </asp:TemplateField>
                        <asp:CommandField ButtonType="Image" DeleteImageUrl="assets/images/basura.png" ShowDeleteButton="True" />
                    </Columns>
                </asp:GridView>
            </div>
        </div>
    </div>
</asp:Content>
